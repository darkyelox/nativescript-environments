var Observable = require("data/observable").Observable;

function createViewModel() {
    var viewModel = new Observable();
    viewModel.message = "I'm in an Productions Environment"

    return viewModel;
}

exports.createViewModel = createViewModel;