const fs = require('fs');
const path = require('path');

const filesToFix = [
    'android/app/capacitor.build.gradle',
    'android/capacitor-cordova-android-plugins/build.gradle'
];

filesToFix.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(
            /JavaVersion\.VERSION_\d+/g, 
            'JavaVersion.VERSION_17'
        );
        fs.writeFileSync(filePath, content);
        console.log(`Updated Java version in ${file}`);
    }
});