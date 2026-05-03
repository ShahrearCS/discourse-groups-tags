# frozen_string_literal: true

# name: discourse-groups-tags
# about: Adds a group_tags custom field to groups for filtering
# version: 0.1
# authors: you

after_initialize do

  ## Allow group_tags to be saved via the group update endpoint
  DiscoursePluginRegistry.register_editable_group_custom_field(:group_tags, self)

  ## Store as JSON so it can hold an array of tag strings
  ## e.g. ["math", "science", "languages"]
  register_group_custom_field_type('group_tags', :json)

  ## Serialize all custom_fields to the client (same as the demo)
  ## group_tags will be available as group.custom_fields.group_tags
  add_to_serializer(:basic_group, :custom_fields) { object.custom_fields }

end