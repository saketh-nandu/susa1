// ALTERNATIVE DOWNLOAD IMPLEMENTATION
// Use this if Google Drive continues to have cross-browser issues

// ============================================
// OPTION 1: DROPBOX IMPLEMENTATION
// ============================================
const DROPBOX_IDE = "https://www.dropbox.com/s/YOUR_ID/SUSA-IDE-Desktop-App-1.0.0.exe?dl=1";
const DROPBOX_COMPLETE = "https://www.dropbox.com/s/YOUR_ID/SUSA-Complete-Setup-1.0.0.exe?dl=1";
const DROPBOX_CLI = "https://www.dropbox.com/s/YOUR_ID/SUSA-CLI-Only-1.0.0.exe?dl=1";

useEffect(() => {
  setDownloadUrls({
    ide: DROPBOX_IDE,
    complete: DROPBOX_COMPLETE,
    cli: DROPBOX_CLI,
  });
}, []);

const handleDownload = async (url: string, fileName: string, version: string) => {
  if (!url || url === "#") {
    alert("Download will be available soon!");
    return;
  }
  
  await trackDownload(fileName, version);
  
  // Dropbox direct download - works perfectly across all browsers
  window.location.href = url;
};

// ============================================
// OPTION 2: GITHUB RELEASES IMPLEMENTATION
// ============================================
const GITHUB_IDE = "https://github.com/YOUR_USERNAME/susa/releases/download/v1.0.0/SUSA-IDE-Desktop-App-1.0.0.exe";
const GITHUB_COMPLETE = "https://github.com/YOUR_USERNAME/susa/releases/download/v1.0.0/SUSA-Complete-Setup-1.0.0.exe";
const GITHUB_CLI = "https://github.com/YOUR_USERNAME/susa/releases/download/v1.0.0/SUSA-CLI-Only-1.0.0.exe";

useEffect(() => {
  setDownloadUrls({
    ide: GITHUB_IDE,
    complete: GITHUB_COMPLETE,
    cli: GITHUB_CLI,
  });
}, []);

const handleDownload = async (url: string, fileName: string, version: string) => {
  if (!url || url === "#") {
    alert("Download will be available soon!");
    return;
  }
  
  await trackDownload(fileName, version);
  
  // GitHub direct download - excellent reliability
  window.location.href = url;
};

// ============================================
// OPTION 3: ONEDRIVE IMPLEMENTATION
// ============================================
// OneDrive direct download format:
// Original: https://onedrive.live.com/?id=ABC123
// Direct: https://onedrive.live.com/download?id=ABC123

const ONEDRIVE_IDE = "https://onedrive.live.com/download?id=YOUR_ID_1";
const ONEDRIVE_COMPLETE = "https://onedrive.live.com/download?id=YOUR_ID_2";
const ONEDRIVE_CLI = "https://onedrive.live.com/download?id=YOUR_ID_3";

useEffect(() => {
  setDownloadUrls({
    ide: ONEDRIVE_IDE,
    complete: ONEDRIVE_COMPLETE,
    cli: ONEDRIVE_CLI,
  });
}, []);

const handleDownload = async (url: string, fileName: string, version: string) => {
  if (!url || url === "#") {
    alert("Download will be available soon!");
    return;
  }
  
  await trackDownload(fileName, version);
  
  // OneDrive direct download
  window.location.href = url;
};

// ============================================
// OPTION 4: MULTIPLE MIRRORS (BEST PRACTICE)
// ============================================
// Provide multiple download sources for reliability

const downloadMirrors = {
  ide: [
    { name: "Google Drive", url: "https://drive.usercontent.google.com/download?id=13E8y5Tw7DRUC2i_hScHjYKkN2QhA7Dmx&export=download" },
    { name: "Dropbox", url: "https://www.dropbox.com/s/YOUR_ID/SUSA-IDE-Desktop-App-1.0.0.exe?dl=1" },
    { name: "GitHub", url: "https://github.com/YOUR_USERNAME/susa/releases/download/v1.0.0/SUSA-IDE-Desktop-App-1.0.0.exe" }
  ],
  complete: [
    { name: "Google Drive", url: "https://drive.usercontent.google.com/download?id=1m3LSb_CCXWf_TAOgr6nxP_VAaT_7VTy2&export=download" },
    { name: "Dropbox", url: "https://www.dropbox.com/s/YOUR_ID/SUSA-Complete-Setup-1.0.0.exe?dl=1" },
    { name: "GitHub", url: "https://github.com/YOUR_USERNAME/susa/releases/download/v1.0.0/SUSA-Complete-Setup-1.0.0.exe" }
  ],
  cli: [
    { name: "Google Drive", url: "https://drive.usercontent.google.com/download?id=1YgqJRhJNXZkY50sRJXVxjHv1jsPJcVAP&export=download" },
    { name: "Dropbox", url: "https://www.dropbox.com/s/YOUR_ID/SUSA-CLI-Only-1.0.0.exe?dl=1" },
    { name: "GitHub", url: "https://github.com/YOUR_USERNAME/susa/releases/download/v1.0.0/SUSA-CLI-Only-1.0.0.exe" }
  ]
};

// Add mirror selection UI to the download button
<div className="space-y-2">
  <Button 
    className="w-full bg-[hsl(190,90%,50%)] hover:bg-[hsl(190,90%,60%)] text-black font-semibold"
    onClick={() => handleDownload(downloadMirrors[option.downloadKey][0].url, option.fileName, option.version)}
  >
    <DownloadIcon className="w-4 h-4 mr-2" />
    Download (Primary)
  </Button>
  
  <div className="flex gap-2">
    {downloadMirrors[option.downloadKey].slice(1).map((mirror, idx) => (
      <Button
        key={idx}
        variant="outline"
        size="sm"
        className="flex-1 text-xs"
        onClick={() => handleDownload(mirror.url, option.fileName, option.version)}
      >
        {mirror.name}
      </Button>
    ))}
  </div>
</div>

// ============================================
// TESTING SCRIPT
// ============================================
// Add this to test downloads in different browsers
// Open browser console and run:

function testDownload(url, browserName) {
  console.log(`Testing download in ${browserName}...`);
  const testLink = document.createElement('a');
  testLink.href = url;
  testLink.download = 'test-file.exe';
  testLink.click();
  
  setTimeout(() => {
    console.log(`${browserName} test completed. Check if download started.`);
  }, 2000);
}

// Test in console:
// testDownload('YOUR_DOWNLOAD_URL', 'Edge');
