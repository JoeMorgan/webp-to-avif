const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
var argv = require('minimist')(process.argv.slice(2));


function errFn(){
	// Do nothing at the moment
}

console.log(`Processing files and directories, starting with ${argv.dir}...`);


function walk(dir){
	fs.readdir(dir, function(err, filenames){
		if(err) {
			console.error("Error: Directory not found")
		}

		filenames.forEach(async function(filename) {
			const subPath = path.join(dir, filename);
			await fs.stat(subPath, (fileError, stats)=>{
				if(stats.isDirectory()){
					walk(subPath);
				}
			});

			const webpExtIndex = filename.indexOf(".webp");
			if(webpExtIndex === -1){
				return;
			}else{

				process.stdout.write(`Generating AVIF version of ${filename}...`);

				const filenameNoExt = filename.substring(0, webpExtIndex);
				await sharp(subPath)
					.metadata()
					.then((metadata)=>{
						sharp(subPath)
							.toFile(path.join(dir, `${filenameNoExt}.avif`), (info, avifError)=>{
								process.stdout.write("...success!\n");
							});
						;
					}
				);
			}

		});
	});
}

walk(argv.dir)



