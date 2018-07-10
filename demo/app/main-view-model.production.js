var Observable = require("data/observable").Observable;

function createViewModel() {
    var viewModel = new Observable();
    viewModel.message = "I'm in an Production Environment"

    return viewModel;
}

exports.createViewModel = createViewModel;