import { Construct } from "constructs";
import { App, Stack, Workflow } from "cdkactions";
import { DeployJob, ReactProject } from "@pennlabs/kraken";

export class PortalStack extends Stack {
  constructor(scope: Construct, name: string) {
    super(scope, name);
    const workflow = new Workflow(this, 'build-and-deploy', {
      name: 'Build and Deploy',
      on: 'push',
    });

    const portalJob = new ReactProject(workflow, {
      imageName: 'penn-mobile-portal',
    });

    new DeployJob(workflow, {}, {
      needs: [portalJob.publishJobId]
    });
  }
}

const app = new App();
new PortalStack(app, 'portal');
app.synth();
