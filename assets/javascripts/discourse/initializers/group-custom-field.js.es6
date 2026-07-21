import { withPluginApi } from 'discourse/lib/plugin-api';
import { ajax } from 'discourse/lib/ajax';

async function fetchAllGroups() {
  let allGroups = [];
  let page = 0;

  while (true) {
    const result = await ajax("/groups.json", {
      data: { page }
    });
    const groups = result.groups || [];
    allGroups = allGroups.concat(groups);
    // stop when we've fetched everything
    if (allGroups.length >= result.total_rows_groups || groups.length === 0) {
      break;
    }
    page++;
  }

  return allGroups;
}

export default {
  name: 'group-custom-field',
  initialize() {

    withPluginApi('0.8.30', (api) => {

      // Fetch all groups across all pages then log them
      // fetchAllGroups()
      //   .then((groups) => {
      //     console.log(`All groups loaded: ${groups.length}`);
      //     groups.forEach((group) => {
      //       console.log(group.name, group.custom_fields?.group_tags);
      //     });
      //   })
      //   .catch((err) => console.error("Failed to load groups", err));

      // patch group model to include custom_fields when saving
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