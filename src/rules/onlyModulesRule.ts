/**
 * @fileoverview Rule to disallow implicit variable and function declarations in the global scope.
 * @author Jamie Day
 */

import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "source files must contain at least one top-level import or export";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new OnlyModulesWalker(sourceFile, this.ruleName, this.getOptions()));
    }
}

class OnlyModulesWalker extends Lint.AbstractWalker<Lint.IOptions> {
    public walk(sourceFile: ts.SourceFile) {
        let isModule = false;
        let firstNode: ts.Node | undefined = undefined;
        sourceFile.statements.forEach(statement => {
            const firstToken = statement.getFirstToken(sourceFile);
            if (!firstToken) {
                return;
            }
            switch (firstToken.kind) {
                case ts.SyntaxKind.ExportKeyword:
                    isModule = true;
                    return;
                case ts.SyntaxKind.ImportKeyword:
                    isModule = true;
                    return;
                default:
                    if (!firstNode) {
                        firstNode = statement;
                    }
                    return;
            }
        });
        firstNode = firstNode as unknown as ts.Node;
        if (!isModule && firstNode) {
            let fixNode = firstNode.getFirstToken() || firstNode;
            const fix = new Lint.Replacement(fixNode.getStart(), fixNode.getWidth(), "export " + fixNode.getText());
            this.addFailureAtNode(firstNode, Rule.FAILURE_STRING, fix);
        }
    }
}