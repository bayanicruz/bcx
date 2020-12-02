import { flags, SfdxCommand } from '@salesforce/command';
import { SfdxProject} from '@salesforce/core';
import * as path from 'path';
import * as fs from 'fs';

export default class MetadataReset extends SfdxCommand {

    public static description = 'set defaut username and org wide email in metadata such as workflow based on target scratch org';

    public static examples = [
        `$ sfdx bcx:org:setdefault --targetusername myOrg@example.com`,
        `$ sfdx bcx:org:setdefault --targetusername myOrg@example.com -d src`
    ];

    public static args = [{name: 'file'}];

    protected static flagsConfig = {
        basedir: flags.string({char: 'd', description: 'path of base directory', default:'force-app/main/default'}),
        email: flags.string({char: 'e', description: 'email to replace senderAddress'}) //replace with a set email address
    };
    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // Comment this out if your command does not support a hub org username
    protected static supportsDevhubUsername = false;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;

    public async run() {
        const project = await SfdxProject.resolve();
        var config:any = await project.resolveProjectConfig(); //gets absolute url of sfdx-project.json file
        config = config.plugins.bcx;
	
		let orgname = this.org.getUsername();
		let basedir = this.flags.basedir;

		this.ux.log('Replacing unspported metadata for scratch org i.e.: field update on specific user, send email from org wide email...');

		config.orgdefault_config.forEach(element => {
			var dirpath = path.join(basedir,element.folder);
			if (fs.existsSync(dirpath)){
				console.log(`* Processing ${element.folder} :`);
				fs.readdirSync(dirpath).forEach(file => {
					console.log(`>    ${file}`);
					this.applyRules(element.rules, dirpath+'/'+file,orgname);
				});
			}
		});
	}
	applyRules(rules:any, dirfile:string, username:string){
		let content = fs.readFileSync(dirfile).toString();
		rules.forEach(element => {
			var value = element.replaceby;
			if (element.mergefield === 'username') value = value.split('{{mergevalue}}').join(username); 
            content = content.replace(new RegExp(element.regex,'g'), value);
            
            // if (element.mergefield === 'sender') value = value.split('\n').slice(1).join('\n'); //delete line
            // content = content.replace(new RegExp(element.regex,'g'), value);
		});
		fs.writeFileSync(dirfile, content);
	}
}