import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class GroupTagsField extends Component {
    // Read current value from the group model
    get currentTags() {
        return this.args.outletArgs?.model?.custom_fields?.group_tags || "";
    }

    @action
    onInput(event) {
        // Write back to the model so it gets saved with the group form
        const model = this.args.outletArgs?.model;
        if (model) {
            if (!model.custom_fields) {
                model.set("custom_fields", {});
            }
            model.set("custom_fields.group_tags", event.target.value);
        }
    }
}
