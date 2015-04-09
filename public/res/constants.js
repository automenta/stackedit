define([], function() {
	var constants = {};
	constants.VERSION = "4.3.11-x";
	constants.MAIN_URL = "https://localhost";
	constants.GOOGLE_API_KEY = "";
	constants.GOOGLE_DRIVE_APP_ID = "";
	constants.DROPBOX_APP_KEY = "";
	constants.DROPBOX_APP_SECRET = "";
	constants.DROPBOX_RESTRICTED_APP_KEY = "";
	constants.DROPBOX_RESTRICTED_APP_SECRET = "";
	constants.BITLY_ACCESS_TOKEN = "";
	constants.DEFAULT_FILE_TITLE = "Title";
	constants.DEFAULT_FOLDER_NAME = "New folder";
	constants.GDRIVE_DEFAULT_FILE_TITLE = "New document";
	constants.EDITOR_DEFAULT_PADDING = 35;
	constants.CHECK_ONLINE_PERIOD = 120000;
	constants.AJAX_TIMEOUT = 30000;
	constants.ASYNC_TASK_DEFAULT_TIMEOUT = 60000;
	constants.ASYNC_TASK_LONG_TIMEOUT = 180000;
	constants.USER_IDLE_THRESHOLD = 300000;
	constants.IMPORT_FILE_MAX_CONTENT_SIZE = 100000;
	constants.IMPORT_IMG_MAX_CONTENT_SIZE = 10000000;
	constants.COUCHDB_PAGE_SIZE = 25;
	constants.TEMPORARY_FILE_INDEX = "file.tempIndex";
	constants.WELCOME_DOCUMENT_TITLE = "Untitled";
	constants.DOWNLOAD_IMPORT_URL = "/downloadImport";
	constants.PICASA_IMPORT_IMG_URL = "/picasaImportImg";
	constants.SSH_PUBLISH_URL = '/sshPublish';
	constants.PDF_EXPORT_URL = "/pdfExport";
	constants.COUCHDB_URL = '';

	// Site dependent
	constants.BASE_URL = "http://localhost/";
	constants.GOOGLE_CLIENT_ID = '';
	constants.GITHUB_CLIENT_ID = '';
	constants.GATEKEEPER_URL = "";
	constants.TUMBLR_PROXY_URL = "";
	constants.WORDPRESS_CLIENT_ID = '';
	constants.WORDPRESS_PROXY_URL = "";


	constants.THEME_LIST = {
		"default": "Default",
		"blue": "Blue",
		"gray": "Gray",
		"night": "Night",
		"school": "School",
		"solarized-light": "Solarized Light",
		"solarized-dark": "Solarized Dark"
	};

	return constants;
});
