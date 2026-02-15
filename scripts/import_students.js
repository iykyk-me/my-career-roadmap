const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const iconv = require('iconv-lite');

// Load env vars manually to avoid dotenv dependency if not needed, 
// but user likely has .env.local. Let's try to read it.
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env.local');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });
            console.log('Loaded environment variables from .env.local');
        }
    } catch (e) {
        console.warn('Could not load .env.local', e);
    }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    console.error('Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function importStudents() {
    const csvFilePath = path.resolve(__dirname, '../student_data.csv');

    if (!fs.existsSync(csvFilePath)) {
        console.error(`Error: File not found at ${csvFilePath}`);
        console.log('Please save your CSV file as "student_data.csv" in the project root folder.');
        process.exit(1);
    }

    // Use iconv-lite to handle potential EUC-KR (Excel) encoding
    // If it's UTF-8, it should still work or we can check BOM. 
    // But user likely saved from Excel which defaults to CP949/EUC-KR on Korean Windows.
    const fileContent = fs.readFileSync(csvFilePath);
    const decodedContent = iconv.decode(fileContent, 'euc-kr'); // Try EUC-KR first

    const lines = decodedContent.split(/\r?\n/);

    let isHeader = true;
    let successCount = 0;
    let failCount = 0;

    console.log('Starting import with EUC-KR decoding...');

    for (const line of lines) {
        if (isHeader) {
            isHeader = false;
            continue; // Skip header row
        }

        if (!line.trim()) continue;

        // Simple CSV parsing (assuming no commas in values for now)
        // Format based on screenshot: student_number, name, password, first_login, is_data..., department, class_name, gender, clubs
        const columns = line.split(',').map(col => col.trim());

        // Adjust index based on your CSV structure
        const studentNumber = columns[0];
        const name = columns[1];
        const password = columns[2];
        const department = columns[5];
        // const className = columns[6]; // Not used in schema yet

        if (!studentNumber || !name || !password) {
            console.warn(`Skipping invalid line: ${line}`);
            continue;
        }

        const email = `student${studentNumber}@school.com`; // Update email format as needed

        try {
            // 1. Create User in Auth
            const { data: user, error: authError } = await supabase.auth.admin.createUser({
                email: email,
                password: password,
                email_confirm: true,
                user_metadata: { name: name }
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    console.log(`User ${name} (${email}) already exists. Updating profile...`);
                    // Fetch existing user ID if possible or just try update profile by matching email logic?
                    // Admin API listUsers is expensive. Let's assume we can't easily get ID if not returned.
                    // Actually, we can assume the existing user has this email.
                    // But for now, let's just log and skip or try to update if we had valid ID.
                    // Without ID, we can't update profile easily via RLS/Admin without query.
                    // Let's try to get ID.
                    /* 
                    const { data: users } = await supabase.auth.admin.listUsers();
                    const existing = users.users.find(u => u.email === email);
                    if (existing) userId = existing.id; 
                    */
                    failCount++;
                    continue;
                } else {
                    throw authError;
                }
            }

            const userId = user.user.id;

            // 2. Update Profile (created by trigger) with extra details
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    student_number: studentNumber,
                    department: department,
                    target_job: '미정', // Default
                    grade: 1 // Default, or parse from className if possible
                })
                .eq('id', userId);

            if (profileError) {
                console.error(`Failed to update profile for ${name}:`, profileError.message);
                failCount++;
            } else {
                console.log(`Successfully created user: ${name} (${email})`);
                successCount++;
            }

        } catch (err) {
            console.error(`Error processing ${name}:`, err.message);
            failCount++;
        }
    }

    console.log(`\nImport completed.`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
}

importStudents();
