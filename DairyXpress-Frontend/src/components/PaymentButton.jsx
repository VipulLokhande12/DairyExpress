import axios from "axios";

const PaymentButton = ({ amount, onSuccess }) => {

    const handlePayment = async () => {

        try {

            // Step 1: Create Razorpay Order
            const createResponse = await axios.post(
                `${import.meta.env.VITE_API_URL}/payment/create`,
                {
                    amount: amount
                }
            );

            const order = createResponse.data;

            // Step 2: Configure Razorpay
            const options = {

                key: order.key,

                amount: order.amount,

                currency: order.currency,

                name: "DairyXpress",

                description: "Milk Order Payment",

                order_id: order.orderId,

                handler: async function (response) {

                    try {

                        // Step 3: Verify Payment
                        await axios.post(
                            `${import.meta.env.VITE_API_URL}/payment/verify`,
                            {
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature
                            }
                        );

                        alert("Payment Successful!");

                        // Step 4: Continue Order Creation
                        if (onSuccess) {
                            onSuccess();
                        }

                    } catch (error) {

                        console.error(error);

                        alert("Payment Verification Failed");

                    }

                },

                prefill: {

                    name: "",

                    email: "",

                    contact: ""

                },

                theme: {

                    color: "#1976d2"

                }

            };

            const razorpay = new window.Razorpay(options);

            razorpay.open();

        } catch (error) {

            console.error(error);

            alert("Unable to start payment");

        }

    };

    return (

        <button
            onClick={handlePayment}
            style={{
                padding: "12px 20px",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
            }}
        >
            Pay ₹{amount}
        </button>

    );

};

export default PaymentButton;