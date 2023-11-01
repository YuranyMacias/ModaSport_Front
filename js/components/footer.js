const footerClient = () => {
    const footer = document.getElementById('footer');

    const footerHTML = `
        <div class="container">
            <div
                class="row row-cols-1 row-cols-sm-1 row-cols-md-3 row-cols-lg-4 g-4 footer-body justify-content-center">
                <div class="col-8 col-sm-3 logo d-flex flex-column align-items-center">
                    <hr class="w-100">
                    <figure class="ratio ratio-1x1">
                        <img src="/assets/images/logoWhite300.png" alt="">
                    </figure>
                </div>

                <div class="col col-sm-4 payment-methods">
                    <div class="d-flex flex-column align-items-center text-center">
                        <hr class="w-100">
                        <h2>Medios de pago.</h2>
                        <P><i class="fa-brands fa-cc-visa mx-2"></i> Visa</P>
                        <P><i class="fa-brands fa-cc-mastercard mx-2"></i> MasterCard</P>
                        <P><i class="fa-brands fa-cc-paypal mx-2"></i> PayPal</P>
                        <P><i class="fa-brands fa-cc-paypal mx-2"></i> PSE</P>
                    </div>
                </div>

                <div class="col col-sm-5 contact">
                    <div class="d-flex flex-column align-items-center text-center">
                        <hr class="w-100">
                        <h2>Contactos</h2>
                        <p>
                            <i class="fa-solid fa-phone mx-2"></i>(+57) 3112345678
                        </p>
                        <p>
                            <i class="fa-brands fa-whatsapp mx-2"></i>(+57) 3112345678
                        </p>
                        <p>
                            <i class="fa-solid fa-envelope mx-2"></i>modaSport@gmail.com
                        </p>
                        <p>
                            <i class="fa-brands fa-instagram"></i>ModaSport
                        </p>

                    </div>
                </div>
            </div>

        </div>`;

    footer.innerHTML = footerHTML;
}

footerClient();

