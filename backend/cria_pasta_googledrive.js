const { google } = require('googleapis');
const path = require('path');

// Caminho para sua chave JSON da conta de serviço
const KEY_PATH = path.join(__dirname, 'drive-service-account.json');

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_PATH,
  scopes: ['https://www.googleapis.com/auth/drive']
});

async function criarPasta() {
  const authClient = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: authClient });

  const folderMetadata = {
    name: 'FOTOS_API_TI_ALERTS',
    mimeType: 'application/vnd.google-apps.folder'
  };

  try {
    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: 'id'
    });

    console.log('Pasta criada com sucesso!');
    console.log('ID da pasta:', folder.data.id);
  } catch (error) {
    console.error('Erro ao criar pasta no Drive:', error);
  }
}

criarPasta();
