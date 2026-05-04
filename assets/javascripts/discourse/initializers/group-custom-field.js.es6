import { withPluginApi } from 'discourse/lib/plugin-api';
import { ajax } from 'discourse/lib/ajax';

export default {
  name: 'group-custom-field',
  initialize() {

    withPluginApi('0.8.30', (api) => {

      // Log groups and their tags
      ajax("/groups.json")
        .then((result) => {
          result.groups.forEach((group) => {
            console.log(group.name, group.custom_fields?.group_tags);
          });
        })
        .catch((err) => console.error("Failed to load groups", err));

      // Patch group model to include custom_fields when saving
      api.modifyClass('model:group', {
        custom_fields: {},

        asJSON() {
          return Object.assign(this._super(), {
            custom_fields: this.custom_fields
          });
        }
      });

    });

  }
}