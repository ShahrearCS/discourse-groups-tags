import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class TagFilterBar extends Component {
    @tracked activeTag = null;

    // Collect every unique tag across all loaded groups
    get allTags() {
        const tags = new Set();
        const groups = this.args.outletArgs?.groups || [];

        groups.forEach((group) => {
            const raw = group.custom_fields?.group_tags;
            if (raw) {
                // Handle both array (already parsed) and string (comma-separated)
                const list = Array.isArray(raw)
                    ? raw
                    : raw.split(",").map((t) => t.trim());
                list.forEach((t) => { if (t) tags.add(t); });
            }
        });

        return [...tags].sort();
    }

    get hasAnyTags() {
        return this.allTags.length > 0;
    }

    @action
    filterByTag(tag) {
        // Toggle off if clicking the same tag again
        this.activeTag = this.activeTag === tag ? null : tag;
        this._applyFilter();
    }

    @action
    clearFilter() {
        this.activeTag = null;
        this._applyFilter();
    }

    _applyFilter() {
        const groups = this.args.outletArgs?.groups || [];

        // Find all group card elements and show/hide based on tag match
        document.querySelectorAll(".group-box").forEach((el) => {
            // Discourse renders group name as a data attribute or in a link
            const nameEl = el.querySelector("a.group-link, h4 a, .group-info a");
            if (!nameEl) return;

            // Extract group name from href e.g. /g/my-group → my-group
            const href = nameEl.getAttribute("href") || "";
            const groupName = href.replace("/g/", "").split("/")[0];

            const group = groups.find((g) => g.name === groupName);
            const groupTags = group?.custom_fields?.group_tags;

            let tagList = [];
            if (Array.isArray(groupTags)) {
                tagList = groupTags;
            } else if (typeof groupTags === "string") {
                tagList = groupTags.split(",").map((t) => t.trim());
            }

            const show = !this.activeTag || tagList.includes(this.activeTag);
            el.style.display = show ? "" : "none";
        });
    }
}
