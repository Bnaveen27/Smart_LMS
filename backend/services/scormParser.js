const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const xml2js = require('xml2js');

const SCORM_UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'scorm');

if (!fs.existsSync(SCORM_UPLOAD_DIR)) {
  fs.mkdirSync(SCORM_UPLOAD_DIR, { recursive: true });
}

async function processScormZip(zipSource, packageId) {
  const targetExtractDir = path.join(SCORM_UPLOAD_DIR, packageId);
  if (!fs.existsSync(targetExtractDir)) {
    fs.mkdirSync(targetExtractDir, { recursive: true });
  }

  const zip = new AdmZip(zipSource);
  zip.extractAllTo(targetExtractDir, true);

  let manifestPath = path.join(targetExtractDir, 'imsmanifest.xml');
  let relativeBase = '';

  if (!fs.existsSync(manifestPath)) {
    
    const entries = fs.readdirSync(targetExtractDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subManifest = path.join(targetExtractDir, entry.name, 'imsmanifest.xml');
        if (fs.existsSync(subManifest)) {
          manifestPath = subManifest;
          relativeBase = entry.name;
          break;
        }
      }
    }
  }

  if (!fs.existsSync(manifestPath)) {
    
    const fallbackLaunch = findFallbackLaunchFile(targetExtractDir, relativeBase);
    return {
      title: `SCORM Package (${packageId.slice(0, 8)})`,
      version: 'SCORM_1.2',
      manifest_identifier: `manifest-${packageId}`,
      entry_point: fallbackLaunch,
      launch_url: `/uploads/scorm/${packageId}/${fallbackLaunch}`.replace(/\/+/g, '/'),
      package_path: targetExtractDir,
      mastery_score: 80.0
    };
  }

  const manifestXml = fs.readFileSync(manifestPath, 'utf8');
  const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: false });
  const manifest = await parser.parseStringPromise(manifestXml);

  return parseManifestData(manifest, targetExtractDir, packageId, relativeBase);
}

function parseManifestData(manifest, targetExtractDir, packageId, relativeBase) {
  const root = manifest.manifest || manifest;
  const identifier = root.$?.identifier || `manifest-${packageId}`;

  let version = 'SCORM_1.2';
  try {
    const schemaVersion = root.metadata?.schemaversion || root.metadata?.['adlcp:schemaversion'] || '';
    if (typeof schemaVersion === 'string' && (schemaVersion.includes('2004') || schemaVersion.includes('1.3') || schemaVersion.includes('CAM 1.3'))) {
      version = 'SCORM_2004';
    } else if (manifestXmlContains2004(JSON.stringify(root))) {
      version = 'SCORM_2004';
    }
  } catch (e) {
    version = 'SCORM_1.2';
  }

  let title = 'SCORM Course Module';
  try {
    const orgs = root.organizations;
    if (orgs?.organization) {
      const org = Array.isArray(orgs.organization) ? orgs.organization[0] : orgs.organization;
      if (org.title) {
        title = typeof org.title === 'string' ? org.title : (org.title._ || title);
      }
      if (org.item) {
        const item = Array.isArray(org.item) ? org.item[0] : org.item;
        if (item.title && typeof item.title === 'string') {
          title = item.title;
        }
      }
    }
  } catch (e) {}

  let entryPoint = 'index.html';
  let masteryScore = 80.0;

  try {
    const resources = root.resources?.resource;
    if (resources) {
      const resList = Array.isArray(resources) ? resources : [resources];
      
      const scoRes = resList.find(r => (r.$?.['adlcp:scormType'] || r.$?.['adlcp:scormtype'])?.toLowerCase() === 'sco' && r.$?.href) ||
                     resList.find(r => r.$?.href);

      if (scoRes && scoRes.$?.href) {
        entryPoint = scoRes.$.href;
      }

      const rawMastery = scoRes?.['adlcp:masteryscore'] || scoRes?.$?.['adlcp:masteryscore'];
      if (rawMastery) {
        masteryScore = parseFloat(rawMastery) || 80.0;
      }
    }
  } catch (e) {}

  if (relativeBase) {
    entryPoint = path.posix.join(relativeBase, entryPoint);
  }

  const cleanLaunch = entryPoint.replace(/\\/g, '/').replace(/^\/+/, '');
  const launch_url = `/uploads/scorm/${packageId}/${cleanLaunch}`;

  return {
    title: title.trim(),
    version,
    manifest_identifier: identifier,
    entry_point: cleanLaunch,
    launch_url,
    package_path: targetExtractDir,
    mastery_score: masteryScore
  };
}

function manifestXmlContains2004(str) {
  return str.includes('2004') || str.includes('imsss') || str.includes('adlseq');
}

function findFallbackLaunchFile(dir, relativeBase) {
  const candidates = ['index.html', 'index.htm', 'story.html', 'launch.html', 'player.html', 'scormdriver/indexAPI.html'];
  for (const c of candidates) {
    const full = path.join(dir, relativeBase, c);
    if (fs.existsSync(full)) {
      return path.posix.join(relativeBase, c);
    }
  }
  return 'index.html';
}

module.exports = {
  processScormZip,
  SCORM_UPLOAD_DIR
};
