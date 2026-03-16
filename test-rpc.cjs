const { spawn } = require('child_process');

const proc = spawn('openclaw', ['agent', '--mode', 'rpc'], { 
    cwd: '/Users/taijin/openclaw-workspace/openclaw' 
});

proc.stdout.on('data', (d) => {
    // try parsing RPC response
    const str = d.toString();
    console.log('[STDOUT]', str);
    try {
        const lines = str.split('\n').filter(l => l.trim().startsWith('{'));
        for (const line of lines) {
            const msg = JSON.parse(line);
            if (msg.id === 1) {
                console.log('SUCCESS, QR Data URL:', msg.result.qrDataUrl);
                process.exit(0);
            }
        }
    } catch(e) {}
});

proc.stderr.on('data', (d) => console.log('[STDERR]', d.toString()));

proc.on('close', () => console.log('closed'));

setTimeout(() => {
    // Send RPC request
    const req = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "web.login.start",
        params: { force: true }
    }) + "\n";
    console.log('Sending request:', req);
    proc.stdin.write(req);
}, 2000);

setTimeout(() => {
    console.log('Timeout hit.');
    process.exit(1);
}, 10000);
