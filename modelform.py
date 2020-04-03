
class ModelForm:

    def __init__(self, request, model, fields):
        self.request = request
        self.model = model
        self.fields = fields  # list of ModelField and CustomField objects

    def get_fields(self):
        """Returns field metadata for form"""
        model = self.request.env.get(self.model)

        model_fields = [
            f.name for f in self.fields if isinstance(f, ModelField)]

        model_field_meta = model.fields_get(allfields=model_fields)

        form_fields = []
        for f in self.fields:
            if isinstance(f, ModelField):
                meta = model_field_meta.get(f.name)
                meta['name'] = f.name
                form_fields.append(model_field_meta.get(f.name))
            elif isinstance(f, CustomField):
                form_fields.append(vars(f))

        return form_fields


class ModelField:
    def __init__(self, name):
        self.name = name


class CustomField:
    def __init__(self, name, type, string, required=False):
        self.name = name
        self.string = string
        self.required = required
