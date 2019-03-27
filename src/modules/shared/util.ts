export function fileTypeDetection(inputFilename: string): string {
  const types: { [ key: string ]: string } = {
    'jpg': 'image',
    'jpeg': 'image',
    'tif': 'image',
    'psd': 'image',
    'bmp': 'image',
    'png': 'image',
    'nef': 'image',
    'tiff': 'image',
    'cr2': 'image',
    'dwg': 'image',
    'cdr': 'image',
    'ai': 'image',
    'indd': 'image',
    'pin': 'image',
    'cdp': 'image',
    'skp': 'image',
    'stp': 'image',
    '3dm': 'image',
    'svg': 'image',
    'pdf': 'pdf',
    'xls': 'excel',
    'xlsx': 'excel',
    'ods': 'excel',
    'doc': 'word',
    'docx': 'word',
    'eps': 'word',
    'odt': 'word',
    'rtf': 'word',
    'txt': 'text'
  };

  const chunks = inputFilename.split('.');
  if (chunks.length < 2) {
    return 'undefined';
  }
  const extension = chunks[chunks.length - 1].toLowerCase();
  if (types[extension] === undefined) {
    return 'undefined';
  } else {
    return types[extension];
  }
}
