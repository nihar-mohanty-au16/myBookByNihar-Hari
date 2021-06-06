paypal.Button.render({  
    env: 'sandbox',
    client: {
        sandbox: 'demo_sandbox_client_id',
        production: 'demo_production_client_id'
    },  
    locale: 'en_US',
    style: {
        size: 'medium',
        color: 'gold',
        shape: 'pill',
    },  
    commit: true,
    // Set up a payment
    payment: function(data, actions) {
        return actions.payment.create({
            transactions: [{
            amount: {
                total: `${document.getElementById('paypal-button').value}`,
                currency: 'USD'
            }
            }]
        });
    },
    // Execute the payment
    onAuthorize: function(data, actions) {
        return actions.payment.execute().then(function() {
            // Show a confirmation message to the buyer
            window.alert('Thank you for your purchase!');
        });
    }
}, '#paypal-button');