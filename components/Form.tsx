import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";

export type FilterData = {
  type: string;
  name: string;
  data?: any[];
  selectedValue?: string;
}[];

const MyForm = ({ filterData }: { filterData: FilterData | undefined }) => {
  const router = useRouter();
  const [inputsHtml, setInputsHtml] = useState<JSX.Element[]>();
  const [intialValues, setIntialValues] = useState<any>({});
  const onSubmit = (values: any) => {
    console.log(values);
    router.push(
      { pathname: "/test", query: values },
      { pathname: "/test", query: values },
      { shallow: true }
    );
  };

  const formik = useFormik({
    initialValues: intialValues,
    enableReinitialize: true,
    onSubmit,
    onReset: () => {
      console.log("reseted");
    },
  });

  useEffect(() => {
    filterData &&
      setIntialValues(() => {
        return filterData.reduce((prev, curr) => {
          return { ...prev, [curr.name]: curr.selectedValue };
        }, {});
      });
    filterData &&
      setInputsHtml(() => {
        return filterData.map((item) => {
          let input = <></>;
          switch (item.type) {
            case "text":
              input = (
                <TextField
                  type={item.type}
                  name={item.name}
                  label={item.name}
                  variant="standard"
                  onChange={formik.handleChange}
                  defaultValue={item.selectedValue}
                />
              );
              break;
            case "checkbox":
              input = (
                <FormControl
                  sx={{ m: 3 }}
                  component="fieldset"
                  variant="standard"
                >
                  <FormLabel component="legend">{item.name}</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={item.name}
                          defaultChecked={item.selectedValue === "true"}
                          onChange={formik.handleChange}
                        />
                      }
                      name={item.name}
                      label="true"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={item.name + "_false"}
                          defaultChecked={item.selectedValue === "false"}
                          onChange={formik.handleChange}
                        />
                      }
                      label="false"
                    />
                  </FormGroup>
                </FormControl>
              );
            default:
              break;
          }
          return (
            <section key={item.name} className="row">
              {input}
            </section>
          );
        });
      });
  }, [filterData]);

  return (
    <div>
      <h1>My form</h1>
      <form
        className="flex flex-col"
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
      >
        {inputsHtml}
        <button
          className="bg-blue-600 rounded text-white px-5 py-2"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MyForm;
