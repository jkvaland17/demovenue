import { Chip } from "@nextui-org/react";
import moment from "moment";
import React from "react";

const ViwePayment: React.FC<any> = ({ selectedPayment }) => {
  console.log("selectedPayment::: ", selectedPayment);
  return (
    <div>
      {selectedPayment ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">Vendor Name</p>
            <p className="font-medium">
              {selectedPayment?.vendorId?.vendorName || "-"}
            </p>
          </div>
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">Work Scope</p>
            <p className="font-medium">
              {selectedPayment?.workScopeId?.workScopeTitle || "-"}
            </p>
          </div>
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{selectedPayment?.name || "-"}</p>
          </div>
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">Bank Name</p>
            <p className="font-medium">{selectedPayment?.bankname || "-"}</p>
          </div>
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">Account Number</p>
            <p className="font-medium">{selectedPayment?.accountNumber || "-"}</p>
          </div>
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">IFSC Code</p>
            <p className="font-medium">{selectedPayment?.ifscCode || "-"}</p>
          </div>
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">Beneficiary ID</p>
            <p className="font-medium">
              {selectedPayment?.beneficiaryId || "-"}
            </p>
          </div>
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">UTR Number</p>
            <p className="font-medium">{selectedPayment?.utrNumber || "-"}</p>
          </div>
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">Status</p>
            <Chip
              variant="flat"
              color={
                selectedPayment?.status === "Completed"
                  ? "success"
                  : selectedPayment?.status === "Rejected"
                    ? "danger"
                    : "primary"
              }
              classNames={{ content: "capitalize" }}
            >
              {selectedPayment?.status || "-"}
            </Chip>
          </div>
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">Payment Date</p>
            <p className="font-medium">
              {selectedPayment?.paymentDate
                ? moment(selectedPayment?.paymentDate).format("ll")
                : "-"}
            </p>
          </div>
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">Credit Amount</p>
            <p className="font-medium text-green-600">
              ₹ {selectedPayment?.creditAmount || "0"}
            </p>
          </div>
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">Creation Date</p>
            <p className="font-medium">
              {selectedPayment?.createdAt
                ? moment(selectedPayment?.createdAt).format("ll")
                : "-"}
            </p>
          </div>
          <div className="border-b py-2">
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="font-medium">
              {selectedPayment?.updatedAt
                ? moment(selectedPayment?.updatedAt).format("ll")
                : "-"}
            </p>
          </div>
        </div>
      ) : (
        <p>No payment details found</p>
      )}
    </div>
  );
};

export default ViwePayment;
