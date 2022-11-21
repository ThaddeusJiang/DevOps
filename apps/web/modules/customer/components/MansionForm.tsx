import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Mansion } from "types";

type Props = {
  value: Mansion;

  onSave: (value) => void;
  onDelete: (id) => void;
};

type FormData = {
  connectionString?: string;
  databaseId: string;
  frontDoorName: string;
  id: string;
  storageConnectionString?: string;
  domain: string;
};

const MansionForm: FC<Props> = (props) => {
  const { value: originalValue } = props;
  // Key's index are the UI input render index.
  let defaultModel: FormData = {
    id: "",
    databaseId: "",
    domain: "",
    frontDoorName: "",
  };
  // Store the props keyName that you want to display in form.
  const formItems = Object.keys(defaultModel) as Array<keyof typeof defaultModel>;
  // Then merge the props to defaultModel.
  defaultModel = Object.assign(defaultModel, originalValue);
  
  const { register, control, reset } = useForm<FormData>({
    defaultValues: {
      ...defaultModel,
    },
  });

  useEffect(() => {
    reset(defaultModel);
  }, [originalValue]);

  // Get the prop you want to display.
  function getDisplayProps(propName) {
      return formItems.indexOf(propName) !== -1;
    ;
  }

  return (
    <>
      <DevTool control={control} />
      <form>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Mansion</h3>
            </div>

            {/* input item */}
            <div className="grid grid-cols-6 gap-4">
              {formItems
                .filter((itemKey) => getDisplayProps(itemKey))
                .map((itemKey) => (
                  <div className="col-span-6 sm:col-span-3 form-control" key={itemKey}>
                    <label htmlFor={itemKey} className="label">
                      {itemKey}
                    </label>
                    <input
                      id={itemKey}
                      className="input input-bordered"
                      {...register(itemKey)}
                      readOnly
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default MansionForm;
