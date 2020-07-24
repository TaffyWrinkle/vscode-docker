/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureWizardPromptStep, IWizardOptions } from 'vscode-azureextensionui';
import { PythonDefaultPorts, PythonProjectType, PythonTarget } from '../../../utils/pythonUtils';
import { ChoosePortsStep } from '../ChoosePortsStep';
import { ScaffoldDebuggingStep } from '../ScaffoldDebuggingStep';
import { ScaffoldFileStep } from '../ScaffoldFileStep';
import { ScaffoldingWizardContext } from '../ScaffoldingWizardContext';
import { ChoosePythonArtifactStep } from './ChoosePythonArtifactStep';
import { PythonGatherInformationStep } from './PythonGatherInformationStep';

export interface PythonScaffoldingWizardContext extends ScaffoldingWizardContext {
    pythonProjectType?: PythonProjectType;
    pythonArtifact?: PythonTarget;
    pythonRequirements?: { [key: string]: string };
    pythonCmdParts?: string[];
    pythonDebugCmdParts?: string[];
}

export function getPythonSubWizardOptions(wizardContext: ScaffoldingWizardContext): IWizardOptions<PythonScaffoldingWizardContext> {
    const promptSteps: AzureWizardPromptStep<PythonScaffoldingWizardContext>[] = [
        new ChoosePythonArtifactStep(),
    ];

    if (wizardContext.platform === 'Python: Django' && wizardContext.scaffoldType === 'all') {
        promptSteps.push(new ChoosePortsStep([PythonDefaultPorts.get('django')]));
    } else if (wizardContext.platform === 'Python: Flask' && wizardContext.scaffoldType === 'all') {
        promptSteps.push(new ChoosePortsStep([PythonDefaultPorts.get('flask')]));
    }

    promptSteps.push(new PythonGatherInformationStep());

    return {
        promptSteps: promptSteps,
        executeSteps: [
            new ScaffoldFileStep('requirements.txt', 0),
            new ScaffoldDebuggingStep(),
        ],
    };
}
