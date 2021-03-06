import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { PasswordResetFormComponent } from './password-reset-form.component';

export default {
    title: 'PasswordResetFormComponent',
    component: PasswordResetFormComponent,
    decorators: [
        moduleMetadata({
            imports: []
        })
    ]
} as Meta<PasswordResetFormComponent>;

/**
 * Template
 *
 * @param args {PasswordResetFormComponent}
 * @constructor
 */
const Template: Story<PasswordResetFormComponent> = (
    args: PasswordResetFormComponent
) => ({
    component: PasswordResetFormComponent,
    props: args
});

/**
 * Primary
 */
export const Primary = Template.bind({});
Primary.args = {};
