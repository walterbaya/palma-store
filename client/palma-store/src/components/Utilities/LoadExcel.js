import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as XLSX from "xlsx";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";

function get_list_articulos(sheet) {
  let res = [];

  sheet.forEach((sheet_obj) => {
    Object.keys(sheet_obj).forEach((key) => {
      const obj = {
        name: "",
        size: "",
        color: "",
        leatherType: "",
        shoeType: "",
        gender: "",
        numberOfElements: "",
        price: "",
      };
      const size = parseInt(key);
      if (size <= 46 && size >= 35) {
        obj.name = sheet_obj.ARTICULO;
        obj.size = size;
        obj.color = sheet_obj.COLOR;
        obj.leatherType = sheet_obj.CUERO;
        obj.shoeType = sheet_obj.TIPO;
        obj.gender = sheet_obj.GENERO === "M" ? true : false;
        obj.numberOfElements = sheet_obj[key];
        obj.price = sheet_obj.PRECIO;
        console.log(obj);
        res.push(obj);
      }
    });
  });

  console.log(res);
  return res;
}

function LoadExcel() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const xlsx_sheet = XLSX.utils.sheet_to_json(sheet);
      const json = get_list_articulos(xlsx_sheet);

      console.log(json)

      axios
        .post("http://localhost:8080/api/public/product/add_products", json)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
    };
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Cargar Excel con Artículos
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cargar Excel con Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Todos los articulos anteriormente cargados serán eliminados y
            reemplazados por la información que se suministre en este Excel.
          </p>

          <FileUploader
            classes="drop_zone"
            handleChange={handleFileUpload}
            name="file"
            hoverTitle=" "
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoadExcel;
