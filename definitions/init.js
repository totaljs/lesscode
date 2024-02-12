function makepath(name) {
	return PATH.databases('flowstreams' + (name ? ('/' + name + '.json') : ''));
}

CONF.ui && Flow.on('save', function(schema) {
	schema.dtupdated = new Date();
	var data = JSON.stringify(schema, null, '\t');
	F.Fs.writeFile(makepath(schema.id), data, ERROR('Flow.save'));
	CONF.backup && F.Fs.appendFile(PATH.databases(schema.id + '.bk'), data + '\n', NOOP);
});

ON('ready', function() {
	setTimeout(function() {

		if (CONF.ui) {
			let divider = '----------------------------------------------------';
			console.log(divider);
			console.log('Edit FlowStreams:');
			console.log('http://127.0.0.1:{$port}/flowstreams/?token={token}'.args(CONF));
			console.log(divider);
			console.log();
		}

		F.Fs.readdir(makepath(), function(err, response) {
			response.wait(async function(filename, next) {

				if (!filename.endsWith('.json')) {
					next();
					return;
				}

				var id = filename.replace(/\.json/i, '').toLowerCase();
				var flowstream = await F.readfile(makepath(id), 'utf8');

				flowstream = flowstream.parseJSON(true);
				flowstream.id = id;

				Flow.load(flowstream, function(err) {
					err && console.error('Flow load ERROR:', err);
					next();
				});
			});
		});
	}, 1000);
});

// Load websocket
// max. 8 MB
CONF.ui && ROUTE('SOCKET /flowstreams/{id}/ <8MB', function($) {

	$.autodestroy();

	Flow.socket($.params.id, $, function(client, next) {
		if (BLOCKED(client, 10) || CONF.token !== client.query.token) {
			client.destroy();
		} else {
			BLOCKED(client, -1);
			next();
		}
	});

});

CONF.ui && ROUTE('GET /flowstreams/', function($) {

	if (BLOCKED($, 10) || CONF.token !== $.query.token) {
		$.invalid(401);
		return;
	}

	var builder = [];
	var editor = CONF.floweditor || 'https://flow.totaljs.com';

	if ($.xhr || $.query.type === 'json') {

		for (let key in Flow.instances) {
			let db = Flow.db[key];
			let instance = Flow.instances[key];
			let stats = instance.stats;
			let newstats = stats ? { memory: stats.memory, messages: stats.messages, pending: stats.pending, minutes: stats.minutes, paused: stats.paused, mm: stats.mm, errors: stats.errors } : EMPTYOBJECT;
			builder.push({ id: key, name: db.name, icon: db.icon, color: db.color, readme: db.readme, url: editor + '?socket=' + encodeURIComponent($.hostname('/flowstreams/{0}/?token={1}'.format(key, CONF.token))), stats: newstats });
		}

		$.json(builder);

	} else {
		builder.push('<html><head><meta charset="utf-8" /><title>{0}</title></head><body style="padding:20px;font-family:Arial"><div>FlowStreams:</div><ul>'.format(CONF.name));
		for (let key in Flow.instances)
			builder.push('<li><a href="{0}" target="_blank">{1}</a></li>'.format(editor + '?socket=' + encodeURIComponent($.hostname('/flowstreams/{0}/?token={1}'.format(key, CONF.token))), key));
		builder.push('</ul></body></html>');
		$.html(builder.join('\n'));
	}

	BLOCKED($, -1);
});