# name: discourse-groups-tags
# about: Adds a comma-separated tags custom field to Discourse groups
# version: 0.1
# authors: you

after_initialize do

  ## 1. Register field as a string type
  ##    Tags are stored as a comma-separated string e.g. "math,science,languages"
  register_group_custom_field_type("group_tags", :string)

  ## 2. Whitelist it so it can be saved via the group update endpoint
  DiscoursePluginRegistry.register_editable_group_custom_field(:group_tags, self)

  ## 3. Expose on the full group serializer (used on /g/groupname page)
  ##    Returns tags as a clean array e.g. ["math", "science", "languages"]
  add_to_serializer(:group, :group_tags) do
    raw = object.custom_fields["group_tags"]
    return [] if raw.blank?
    raw.split(",").map(&:strip).reject(&:blank?)
  end

  ## 4. Also expose on basic_group serializer (used in group lists and search)
  add_to_serializer(:basic_group, :group_tags) do
    raw = object.custom_fields["group_tags"]
    return [] if raw.blank?
    raw.split(",").map(&:strip).reject(&:blank?)
  end

  ## 5. Allow groups to be searched/filtered by tag via the groups API
  ##    GET /groups.json?filter_tag=math
  module ::GroupsControllerExtension
    def index
      if params[:filter_tag].present?
        tag = params[:filter_tag].strip.downcase

        ## Find group IDs whose group_tags custom field contains the tag
        matching_ids = GroupCustomField
          .where(name: "group_tags")
          .select { |f| f.value.to_s.split(",").map(&:strip).map(&:downcase).include?(tag) }
          .map(&:group_id)

        @groups = Group.where(id: matching_ids)

        render json: {
          groups: @groups.map { |g|
            {
              id:           g.id,
              name:         g.name,
              full_name:    g.full_name,
              member_count: g.user_count,
              group_tags:   g.custom_fields["group_tags"].to_s.split(",").map(&:strip)
            }
          }
        }
      else
        super
      end
    end
  end

  GroupsController.prepend(::GroupsControllerExtension)

end