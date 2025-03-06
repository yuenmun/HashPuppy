# HashPuppy - Document Integrity Verification Tool

A lightweight, client-side web application for verifying document integrity using SHA-256 hashing.

## Features

- **Generate Hash**: Upload any document and calculate its unique SHA-256 hash
- **Verify Integrity**: Confirm a document has not been altered by comparing its hash
- **Save Hash Information**: Store hash details as a JSON file for future verification
- **Client-Side Processing**: All operations happen locally in your browser - no data is sent to any server
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

### Generate a Document Hash

1. Go to the "Generate Hash" tab
2. Click "Choose a document" and select the file you want to hash
3. Click the "Generate Hash" button
4. View the generated hash and timestamp
5. Optionally, copy the hash to clipboard or save the hash information as a JSON file

### Verify a Document

1. Go to the "Verify Document" tab
2. Click "Choose a document" and select the file you want to verify
3. Either:
   - Enter the expected hash manually in the text area, OR
   - Upload a previously saved hash JSON file
4. Click the "Verify Document" button
5. View the verification result - the system will show whether the document matches the expected hash

## Security

- All processing happens client-side in your browser
- No document data is ever sent to a server
- Uses the Web Crypto API for secure, standards-based cryptographic operations

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- Uses the FileReader API to handle file uploads
- Implements the Web Crypto API for secure SHA-256 hashing
- No external libraries or frameworks required (except Font Awesome for icons)

## Getting Started

Simply open the `index.html` file in any modern web browser. No installation or server setup required.

## Browser Compatibility

HashPuppy works in all modern browsers that support the Web Crypto API, including:
- Chrome 37+
- Firefox 34+
- Safari 11+
- Edge 12+

## License

MIT License 