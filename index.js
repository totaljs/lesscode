require('total5');

const options = {};

// options.ip = '127.0.0.1';
// options.port = parseInt(process.argv[2]);
// options.unixsocket = PATH.join(F.tmpdir, 'app_name.socket');
// options.unixsocket777 = true;
// options.config = { name: 'Total.js' };
// options.sleep = 3000;
// options.inspector = 9229;
// options.watch = ['private'];
// options.livereload = 'https://yourhostname';
// options.watcher = false; // disables watcher
// options.edit = 'wss://www.yourcodeinstance.com/?id=projectname'

options.release = process.argv.includes('--release');

// Service mode:
options.servicemode = process.argv.includes('--service') || process.argv.includes('--servicemode');
// options.servicemode = 'definitions,modules,config';

// Cluster:
// options.tz = 'utc';
// options.cluster = 'auto';
// options.limit = 10; // max 10. threads (works only with "auto" scaling)

// Total.run(options);
Total.http(options);

Flow.on('save', function(schema) {
	schema.dtupdated = new Date();
	const data = JSON.stringify(schema, null, '\t');
	Total.Fs.writeFile(PATH.flowstreams(schema.id + '.flow'), data, ERROR('Flow.save'));
});

ON('flowstream', function(flow) {
	Total.syslog('Flow "{id}" is running.'.args(flow));
})

ROUTE('SOCKET / <8MB', function($) {
	$.autodestroy();
	Flow.socket(Object.keys(Flow.instances)[0], $);
});

ROUTE('GET /', $ => $.file(PATH.public('designer.html')));