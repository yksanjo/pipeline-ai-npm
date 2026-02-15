import OpenAI from 'openai';

export type Language = 'nodejs' | 'python' | 'go' | 'ruby' | 'java' | 'rust' | 'php';
export type Platform = 'github-actions' | 'gitlab-ci' | 'circleci' | 'jenkins' | 'aws-codepipeline';
export type DeploymentTarget = 'aws-ecs' | 'aws-lambda' | 'aws-s3' | 'vercel' | 'netlify' | 'heroku' | 'gcp-cloud-run' | 'kubernetes' | 'docker-hub' | 'npm';

export interface PipelineOptions {
  description: string;
  language?: Language;
  platform?: Platform;
  deploymentTarget?: DeploymentTarget;
  features?: string[];
}

export interface PipelineResult {
  success: boolean;
  content?: string;
  filePath?: string;
  platform?: Platform;
  language?: Language;
  error?: string;
}

export class PipelineAI {
  private client: OpenAI;

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY || 'dummy-key'
    });
  }

  async generate(options: PipelineOptions): Promise<PipelineResult> {
    const language = options.language || 'nodejs';
    const platform = options.platform || 'github-actions';

    const prompt = this.buildPrompt(options);

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a DevOps expert. Generate ONLY valid YAML.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      const content = completion.choices[0]?.message?.content || '';

      return {
        success: true,
        content,
        filePath: this.getFilePath(platform),
        platform,
        language
      };
    } catch (error) {
      return this.generateFallback(options);
    }
  }

  private buildPrompt(options: PipelineOptions): string {
    let prompt = `Generate a CI/CD pipeline for ${options.platform || 'github-actions'}.\n`;
    prompt += `Language: ${options.language || 'nodejs'}\n`;
    prompt += `Description: ${options.description}\n`;

    if (options.deploymentTarget) {
      prompt += `Deployment Target: ${options.deploymentTarget}\n`;
    }

    prompt += '\nOutput ONLY valid YAML, no explanations.';

    return prompt;
  }

  private getFilePath(platform: Platform): string {
    switch (platform) {
      case 'github-actions': return '.github/workflows/ci-cd.yml';
      case 'gitlab-ci': return '.gitlab-ci.yml';
      case 'circleci': return '.circleci/config.yml';
      case 'jenkins': return 'Jenkinsfile';
      case 'aws-codepipeline': return 'buildspec.yml';
      default: return 'pipeline.yml';
    }
  }

  private generateFallback(options: PipelineOptions): PipelineResult {
    const language = options.language || 'nodejs';
    const platform = options.platform || 'github-actions';

    const content = this.generateTemplate(language, platform);

    return {
      success: true,
      content,
      filePath: this.getFilePath(platform),
      platform,
      language
    };
  }

  private generateTemplate(language: Language, platform: Platform): string {
    if (platform === 'github-actions') {
      return `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup ${language}
      uses: actions/setup-${language === 'nodejs' ? 'node@v4' : language === 'python' ? 'python@v5' : 'unknown@v1'}
    - name: Install dependencies
      run: ${language === 'nodejs' ? 'npm ci' : language === 'python' ? 'pip install -r requirements.txt' : 'echo "Install"'}
    - name: Run tests
      run: ${language === 'nodejs' ? 'npm test' : language === 'python' ? 'pytest' : 'echo "Test"'}`;
    }

    return `stages:
  - build
  - test

build:
  stage: build
  script:
    - echo "Building ${language}..."`;
  }
}

// Convenience function
export async function generatePipeline(options: PipelineOptions): Promise<PipelineResult> {
  const pipeline = new PipelineAI();
  return pipeline.generate(options);
}
