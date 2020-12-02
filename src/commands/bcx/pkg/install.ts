import { SfdxCommand } from '@salesforce/command';
import { Messages, SfdxProject, SfdxError } from '@salesforce/core';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('bcx', 'bcx');

const exec = require('child_process').execSync;

export default class Install extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx bcx:pkg:install --targetusername myOrg@example.com`
  ];

  //protected static flagsConfig = {};

  // Comment this out if your command does not require an org username
  //populates -u flag and can be accessed using this.org (i.e, this.org.getUsername())
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run() {
    const project = await SfdxProject.resolve();
    var config:any = await project.resolveProjectConfig(); //gets absolute url of sfdx-project.json file
    config = config.plugins.bcx;

    console.log('Installing your (un)managed packages...');
    config.packages.forEach(elem =>{
      try{
        var output = JSON.parse(exec(`sfdx force:package:install --package ${elem} -u ${this.org.getUsername()} -w 60 --json -r`).toString());
        if (output && output.result && output.result.Status === 'SUCCESS'){
          console.log(`Successfully installed package [${elem}]`);
        }else{
          throw new SfdxError(`Error while installing package [${elem}]`);
        }
      }catch(err){
        throw new SfdxError('Unable to install (un)managed packages!');
      }
    });
  }
}
