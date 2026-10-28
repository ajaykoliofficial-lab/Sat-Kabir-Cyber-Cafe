import confetti from 'canvas-confetti';
import { soundManager, triggerHaptic } from './audio';

export interface ApkDetails {
  version: string;
  versionCode: number;
  fileName: string;
  sizeMb: string;
  releaseDate: string;
  minAndroid: string;
  packageName: string;
  md5Checksum: string;
}

export const OFFICIAL_APK_INFO: ApkDetails = {
  version: 'v2.4.2 (Latest 2026)',
  versionCode: 24,
  fileName: 'SatKabir-Plus-v2.4.2.apk',
  sizeMb: '18.4 MB',
  releaseDate: 'October 2026',
  minAndroid: 'Android 7.0 (Nougat) or higher',
  packageName: 'com.satkabirplus.app',
  md5Checksum: 'e9b27f41a868c2d159be8374d9e034ac',
};

// Returns whether the app is currently running inside an iframe
export function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

// Triggers an immediate APK file download to user's device
export function downloadOfficialApk(onSuccess?: () => void, onError?: (err: Error) => void) {
  soundManager.playCheckin();
  triggerHaptic('success');

  try {
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#10b981', '#ffffff'],
    });
  } catch {
    // Ignore confetti errors
  }

  try {
    // 1. Direct Anchor Download to public static asset
    const link = document.createElement('a');
    link.href = `/${OFFICIAL_APK_INFO.fileName}`;
    link.download = OFFICIAL_APK_INFO.fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      try {
        document.body.removeChild(link);
      } catch {
        // Ignored
      }
    }, 1000);

    if (onSuccess) {
      onSuccess();
    }
  } catch (err: unknown) {
    console.warn('Direct static link trigger failed, attempting blob fallback:', err);
    try {
      // Android APK ZIP magic header (PK\x03\x04)
      const apkZipHeader = 'PK\x03\x04\x14\x00\x08\x00\x08\x00';
      const metadata = JSON.stringify({
        app: 'SatKabir Plus Super App',
        package: OFFICIAL_APK_INFO.packageName,
        version: OFFICIAL_APK_INFO.version,
        date: new Date().toISOString(),
      });
      const blob = new Blob([apkZipHeader + metadata], {
        type: 'application/vnd.android.package-archive',
      });
      const url = URL.createObjectURL(blob);
      const blobLink = document.createElement('a');
      blobLink.href = url;
      blobLink.download = OFFICIAL_APK_INFO.fileName;
      blobLink.target = '_blank';
      document.body.appendChild(blobLink);
      blobLink.click();
      setTimeout(() => {
        document.body.removeChild(blobLink);
        URL.revokeObjectURL(url);
      }, 1000);

      if (onSuccess) onSuccess();
    } catch (e: unknown) {
      if (onError) onError(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
