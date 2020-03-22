import { Project, SourceFile } from 'ts-morph';

export function createSourceFile(project: Project, fileName: string, content: string): SourceFile {
	return project.createSourceFile(fileName, content, {
		overwrite: true
	});
}
