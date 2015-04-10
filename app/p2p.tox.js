var toxcore = require('toxcore');

// Create a default Tox instance
//var tox = new toxcore.Tox();

// ... or, create a Tox instance without an internal ToxAV instance
var tox = new toxcore.Tox({
    av: false
});

console.log('tox init');

//// ... or, create a Tox instance using specific paths for toxcore libraries
//var toxAtPath = new toxcore.Tox({
//    path: '/path/to/libtoxcore.so',
//    av: {
//        path: '/path/to/libtoxav.so'
//    }
//});

// Bootstrap from nodes (see a list at: https://wiki.tox.im/Nodes)
tox.bootstrapFromAddressSync('23.226.230.47', 33445, 'A09162D68618E742FFBCA1C2C70385E6679604B2D80EA6E84AD0996A1AC8A074'); // stal
tox.bootstrapFromAddressSync('104.219.184.206', 443, '8CD087E31C67568103E8C2A28653337E90E6B8EDA0D765D57C6B5172B4F1F04C'); // Jfreegman

console.log('bootstrapped');

// Set your name and status message
tox.setNameSync('netbot1');
tox.setStatusMessageSync('developing');

console.log('name and status set');

// Listen for friend requests
tox.on('friendRequest', function(e) {
    console.log('Friend request from: ' + e.publicKeyHex());
});

// Print out your tox address so others can add it
console.log('Address: ' + tox.getAddressHexSync());

// Start!
tox.start();