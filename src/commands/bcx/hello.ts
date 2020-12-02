import { SfdxCommand } from '@salesforce/command';
import { Messages} from '@salesforce/core';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('bcx', 'bcx');

export default class Hello extends SfdxCommand {

  public static description = 'sanity check for successfull installation';

  public static examples = [
    messages.getMessage('happyCoding')
  ];

  //protected static flagsConfig = {};

  // Comment this out if your command does not require an org username
  //populates -u flag and can be accessed using this.org (i.e, this.org.getUsername())
  protected static requiresUsername = false;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run() {
    console.log(messages.getMessage('happyCoding'))
  }
}
