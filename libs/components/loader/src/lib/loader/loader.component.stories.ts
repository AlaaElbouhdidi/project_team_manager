import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { LoaderComponent } from './loader.component';

export default {
    title: 'LoaderComponent',
    component: LoaderComponent,
    decorators: [
        moduleMetadata({
            imports: []
        })
    ]
} as Meta<LoaderComponent>;

/**
 * Template
 *
 * @param args {LoaderComponent}
 * @constructor
 */
const Template: Story<LoaderComponent> = (args: LoaderComponent) => ({
    component: LoaderComponent,
    props: args
});

/**
 * Primary
 */
export const Primary = Template.bind({});
Primary.args = {};
