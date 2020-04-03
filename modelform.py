
class ModelForm:

    def __init__(self, request, model, fields):
        self.request = request
        self.model = model
        self.fields = fields  # list of ModelField and CustomField objects

    def get_field_names(self):
        """Returns field names, in the order they were defined"""
        return [f.name for f in self.fields]

    def get_fields(self):
        """Returns field metadata for form, indexed by field name"""
        model = self.request.env.get(self.model)

        model_fields = [
            f.name for f in self.fields if isinstance(f, ModelField)]

        form_fields = model.fields_get(allfields=model_fields)

        for f in self.fields:

            # Add CustomField fields
            if isinstance(f, CustomField):
                form_fields[f.name] = vars(f)

            # Ensure required keys are present
            if 'name' not in form_fields[f.name]:
                form_fields[f.name]['name'] = f.name
            if 'value' not in form_fields[f.name]:
                form_fields[f.name]['value'] = None

        return form_fields


class ModelField:
    def __init__(self, name):
        self.name = name


class CustomField:
    def __init__(self, name, type, string, required=False):
        self.name = name
        self.string = string
        self.required = required
