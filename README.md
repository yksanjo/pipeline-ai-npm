# 🤖 Pipeline AI - Node.js Library

Generate CI/CD pipelines using AI in your Node.js applications.

## Installation

```bash
npm install pipeline-ai
```

## Usage

```typescript
import { PipelineAI, generatePipeline } from 'pipeline-ai';

// Using the class
const pipeline = new PipelineAI('your-api-key');
const result = await pipeline.generate({
  description: 'Build and test a Node.js app',
  language: 'nodejs',
  platform: 'github-actions'
});

console.log(result.content);

// Or using the convenience function
const result = await generatePipeline({
  description: 'Deploy Python API to AWS',
  language: 'python',
  platform: 'github-actions',
  deploymentTarget: 'aws-lambda'
});
```

## API

### PipelineAI

```typescript
const pipeline = new PipelineAI(apiKey?)
```

#### Methods

##### generate(options: PipelineOptions): Promise<PipelineResult>

Generate a CI/CD pipeline.

```typescript
const result = await pipeline.generate({
  description: 'Build and test a Node.js app',  // required
  language: 'nodejs',    // default: nodejs
  platform: 'github-actions',  // default: github-actions
  deploymentTarget: 'aws-s3'   // optional
});
```

### Types

```typescript
type Language = 'nodejs' | 'python' | 'go' | 'ruby' | 'java' | 'rust' | 'php';
type Platform = 'github-actions' | 'gitlab-ci' | 'circleci' | 'jenkins' | 'aws-codepipeline';
type DeploymentTarget = 'aws-ecs' | 'aws-lambda' | 'aws-s3' | 'vercel' | 'netlify' | 'heroku' | 'gcp-cloud-run' | 'kubernetes' | 'docker-hub' | 'npm';
```

## Example

```typescript
import { PipelineAI } from 'pipeline-ai';

async function main() {
  const pipeline = new PipelineAI();
  
  // Generate a pipeline
  const result = await pipeline.generate({
    description: 'CI/CD for a Python ML model',
    language: 'python',
    platform: 'gitlab-ci',
    deploymentTarget: 'kubernetes'
  });
  
  if (result.success) {
    console.log(result.content);
    // Write to file
    fs.writeFileSync(result.filePath, result.content);
  }
}

main();
```

## Environment Variables

```bash
OPENAI_API_KEY=your_api_key_here
```

## License

MIT
