import {readdir,readFile} from 'node:fs/promises';
import {join} from 'node:path';
const sentinel='ctrl-room-synthetic-build-token-not-a-credential';
let checked=0;
async function scan(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const file=join(directory,entry.name);if(entry.isDirectory())await scan(file);else{checked++;if((await readFile(file)).includes(Buffer.from(sentinel)))throw Error('Synthetic read token leaked into a client artifact: '+file)}}}
await scan('.next/static');
if(!checked)throw Error('No client artifacts found; build first');
console.log('Checked '+checked+' client artifacts: synthetic read token absent.');
