import { Construct } from 'constructs';
import { App } from 'cdk8s';
import { PennLabsChart, ReactApplication } from '@pennlabs/kittyhawk';

export class MyChart extends PennLabsChart {
  constructor(scope: Construct) {
    super(scope);

    const image = 'pennlabs/penn-mobile-portal';
    const domain = 'portal.pennmobile.org';

    new ReactApplication(this, 'react', {
      deployment: {
        image,
      },
      domain: { 
        host: domain, 
        paths: ['/'], 
        isSubdomain: true 
      },
    });
  }
}

const app = new App();
new MyChart(app);
app.synth();
