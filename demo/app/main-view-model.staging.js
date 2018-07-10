var Observable = require("data/observable").Observable;

function createViewModel() {
    var viewModel = new Observable();
    viewModel.message = "I'm in an Stagings Environment"
    
    return viewModel;
}

exports.createViewModel = createViewModel;