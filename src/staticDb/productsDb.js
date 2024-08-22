export default [
    {
        sku: 'a100',
        line: 'original',
        images: ['a100-1', 'a100-3', 'a100-4', 'a100-5', 'a100-6', 'a100-7', 'a100-8', 'a100-design'],
        application: '1” Wood Fences',
        price: 35,
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        }
    },
    { 
        sku: 'a200',
        line: 'original',
        images: ['a200_main', 'a200', 'a200_1', 'a200_2', 'a200_3', 'a100-design'],
        application: '2x6 Wood Fences',
        price: 35,
        inventory: 17,
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        }
    },
    { 
        sku: 'a300',
        line: 'original',
        images: ['a300-2', 'a300-1', 'a300-3', 'a300-4', 'a300-5', 'a300-6', 'a300-7', 'a200-design'],
        application: '6” Cinder Block Walls',
        price: 35,
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        }
    },
    { 
        sku: 'a350',
        line: 'original',
        images: ['a300-1', 'a300-2', 'a300-3', 'a300-4', 'a300-5', 'a300-6', 'a300-7', , 'a200-design'],
        application: '8” Cinder Block Walls',
        price: 35,
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        }
    },
    { 
        sku: 'b100',
        line: 'box',
        images: ['b100-2', 'b100-1', 'b100-3', 'b100-4', 'b100-5', 'b100-6', 'b100-design'],
        application: '1” Wood Fences',
        otherOption: 'b101',
        price: 35,
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        }
    },
    { 
        sku: 'b101',
        line: 'box stacker',
        images: ['b101', 'b101-2', 'b101-design'],
        application: '1” Wood Fences',
        features: 'With Add-on Union Clip',
        otherOption: 'b100',
        price: 35,
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        }
    },
    { 
        sku: 'b200',
        line: 'box',
        images: ['b200', 'b200_1', 'b200_2', 'b200_3', 'b200_4', 'b201_5', 'b100-design'],
        application: '2x6 Wood Fences',
        otherOption: 'b201',
        price: 35,
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        }
    },
    { 
        sku: 'b201',
        line: 'box stacker',
        images: ['b201_2', 'b201', 'b201_3', 'b201_4', 'b201_5', 'b201_6', 'b201_7', 'b201_8', 'b201_9', 'b101-design'],
        application: '2x6 Wood Fences',
        features: 'With Add-on Union Clip',
        otherOption: 'b200',
        price: 35,
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        }
    },
    { 
        sku: 'b300',
        line: 'box',
        images: ['b301-1', 'b300', 'back-350-1', 'b200-design'],
        application: '6” Cinder Block Walls',
        otherOption: 'b301',
        price: 35,
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        }
    },
    { 
        sku: 'b301',
        line: 'box stacker',
        images: ['b301-5', 'b301-1', 'b301-2', 'b301-3', 'b301-4', 'b301-6', 'b201-design'],
        application: '6” Cinder Block Walls',
        features: 'With Add-on Union Clip',
        otherOption: 'b300',
        price: 35,
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        }
    },
    { 
        sku: 'b350',
        line: 'box',
        images: ['b301-1', 'b300', 'back-350-1', 'b300-design', 'b200-design'],
        application: '8” Cinder Block',
        otherOption: 'b351',
        price: 35,
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        }
    },
    { 
        sku: 'b351',
        line: 'box stacker',
        images: ['b301-5', 'b301-1', 'b301-2', 'b301-3', 'b301-4', 'b301-6', 'b201-design'],
        application: '8” Cinder Block',
        features: 'With Add-on Union ˝Clip',
        otherOption: 'b350',
        price: 35,
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        }
    },
    { 
        sku: 'c100',
        line: 'accessory',
        images: ['c100-3', 'c100-4', 'c100-5', 'c100-6', 'c100', 'c100-design'],
        title: 'Extension Bracket',
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        },
        price: 35,
        info: `<p>"The Extension Bracket" is specifically designed to complement an existing Garden Hanger Bracket equipped with an "Add-on Union Clip" at the base of the bracket allowing for effortless expansion of your vertical garden<p>

        <p><h3>Easy Installation</h3>
        
        <h4>1. Choose the Installation Location</h4>
        Select a suitable location for installing your Garden Hanger "Additional Row Attachment". Consider factors such as the weight-bearing capacity of the surface and the desired height for hanging plants.</p>
        <p><h4>2. Position and Place the Bracket</h4>Align the male union of your attachment with the female union of the "Add-on Union Clip" on your primary Garden Hanger. Join them together ensuring a secure fit.</p>
        <p><h4>3. Suspending Planter Boxes</h4>
        Place your planter box onto the designated ledge of the Garden Hanger bracket, ensuring it rests firmly and securely.</p>

        <p><h4>Dimensions:</h4>
        - Steel Thickness = 1 1/2" x 1/4"
        - Steel Width = 1 1/2"</p>

        <p><h4>What's In The Box</h4>
        A set of two "Additional Row Attachment" Garden Hanger brackets.</p>`
    },
    { 
        sku: 'c101',
        line: 'accessory',
        images: ['box2'],
        application: 'Adding Additional Rows',
        title: 'Extension Bracket',
        inventory: 1,
        notes: '',
        status: 'inactive',
        price: 35,
        dimensions: {}
    },
    { 
        sku: 'd100',
        line: 'accessory',
        images: ['box1', 'box2'],
        title: 'Cedar wood box',
        inventory: 1,
        notes: '',
        status: 'active',
        dimensions: {
            length: 26,
            width: 17,
            height: 1.5,
            weight: 5
        },
        price: 35
    }    
];