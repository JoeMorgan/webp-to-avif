const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
var argv = require('minimist')(process.argv.slice(2));

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

				const filenameNoExt = filename.substring(0, webpExtIndex);
				sharp(subPath)
					.metadata()
					.then(async (metadata)=>{
						sharp(subPath)
							.toFile(path.join(dir, `${filenameNoExt}.avif`), (info, avifError)=>{
								console.log(`Generating AVIF version of ${dir}/${filename}`);
							}
						);
					}
				);
			}

		});
	});
}

walk(argv.dir)



