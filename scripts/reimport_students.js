const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

// Load env vars
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
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function reimportStudents() {
    const csvFilePath = path.resolve(__dirname, '../student_data.csv');

    if (!fs.existsSync(csvFilePath)) {
        console.error(`Error: File not found at ${csvFilePath}`);
        process.exit(1);
    }

    // Decode with EUC-KR (Korean Windows Excel default)
    console.log('Reading CSV with EUC-KR encoding...');
    const fileBuffer = fs.readFileSync(csvFilePath);
    const decodedContent = iconv.decode(fileBuffer, 'euc-kr');

    const lines = decodedContent.split(/\r?\n/);

    let isHeader = true;
    let successCount = 0;
    let failCount = 0;
    let deletedCount = 0;

    console.log('Starting Clean & Re-import...');

    for (const line of lines) {
        if (isHeader) {
            isHeader = false;
            continue;
        }

        if (!line.trim()) continue;

        const columns = line.split(',').map(col => col.trim());
        const studentNumber = columns[0];
        const name = columns[1];
        const password = columns[2];
        const department = columns[5];

        if (!studentNumber || !name || !password) continue;

        const email = `student${studentNumber}@school.com`;

        try {
            console.log(`Processing: ${name} (${email})...`);

            // 1. Check if user exists (to delete)
            // We can't easily search by email in Admin API V2 simple list, 
            // but createUser will fail if exists.
            // Let's try to find user by email to delete first.
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

            // This is inefficient for many users, but fine for a class list.
            const existingUser = users.find(u => u.email === email);

            if (existingUser) {
                console.log(` - Found existing user (likely broken). Deleting...`);
                const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);
                if (deleteError) {
                    console.error(` - Failed to delete: ${deleteError.message}`);
                    failCount++;
                    continue;
                }
                deletedCount++;
            }

            // 2. Create User Fresh
            const { data: user, error: createError } = await supabase.auth.admin.createUser({
                email: email,
                password: password,
                email_confirm: true,
                user_metadata: { name: name }
            });

            if (createError) {
                console.error(` - Failed to create: ${createError.message}`);
                failCount++;
                continue;
            }

            // 3. Update Profile (Waiting briefly for trigger to fire? No, trigger fires on DB level immediately)
            // But we can just update it now.
            const userId = user.user.id;

            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    student_number: studentNumber,
                    department: department,
                    target_job: '미정',
                    grade: 1
                })
                .eq('id', userId);

            if (profileError) {
                console.error(` - Failed to update profile: ${profileError.message}`);
                failCount++;
            } else {
                console.log(` - Success!`);
                successCount++;
            }

        } catch (err) {
            console.error(` - Error: ${err.message}`);
            failCount++;
        }
    }

    console.log(`\nRe-import Completed.`);
    console.log(`Deleted: ${deletedCount}`);
    console.log(`Created: ${successCount}`);
    console.log(`Failed: ${failCount}`);
}

reimportStudents();
