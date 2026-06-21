const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'node_modules', 'react-native-reanimated', 'android', 'src', 'main', 'cpp', 'worklets', 'CMakeLists.txt');

if (fs.existsSync(targetFile)) {
  console.log(`[Patch] Found Reanimated CMakeLists.txt at: ${targetFile}`);
  let content = fs.readFileSync(targetFile, 'utf8');
  
  const targetStr = 'target_link_libraries(worklets hermes-engine::libhermes)';
  const replacementStr = `if(ReactAndroid_VERSION_MINOR GREATER_EQUAL 82)
    target_link_libraries(worklets hermes-engine::hermesvm)
  else()
    target_link_libraries(worklets hermes-engine::libhermes)
  endif()`;
  
  if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('[Patch] Successfully patched hermes-engine::libhermes to hermesvm conditional linkage.');
  } else if (content.includes('hermes-engine::hermesvm')) {
    console.log('[Patch] File already patched.');
  } else {
    console.warn('[Patch] Could not find target string in CMakeLists.txt.');
  }
} else {
  console.warn(`[Patch] Reanimated CMakeLists.txt not found at ${targetFile}`);
}
