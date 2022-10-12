import { UserCircleIcon } from "@heroicons/react/outline";
import { FC } from "react";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/dist/client/router";
import CustomerForm from "modules/customer/components/CustomerForm";
import { updateCustomer, upsertCustomer } from "modules/customer/apis/customer";

import { Customer } from "types";

import SectionLoading from "../Loading/SectionLoading";

const navigation = [
  {
    name: "Information",
    href: "#Information",
    icon: UserCircleIcon,
    current: true,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

type Props = { isNew: boolean } & Customer;

const CustomerDetail: FC<Props> = (props) => {
  const { isNew } = props;
  const router = useRouter();

  const queryClient = useQueryClient();

  const onSuccess = async () => {
    toast.success("Success");
    queryClient.refetchQueries(["customers", props.id]);
    router.push("/customers");
  };

  const upsert = useMutation(upsertCustomer, {
    onSuccess,
  });

  const update = useMutation(updateCustomer, { onSuccess });

  const onSave = (value) => {
    if (isNew) {
      upsert.mutate(value);
    } else {
      update.mutate(value);
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 relative">
      <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3 ">
        <nav className="space-y-1 bg-white shadow rounded-md sticky top-0">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-50 text-indigo-700 hover:text-indigo-700 hover:bg-white"
                  : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? "text-indigo-500 group-hover:text-indigo-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <div id="Information" className=" relative ">
          {update.isLoading && <SectionLoading />}
          <CustomerForm isNew={isNew} {...props} onSave={onSave} />
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
