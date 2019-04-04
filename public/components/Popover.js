import ReactDOM from 'react-dom';

export default function createPopover(id, component, options) {
    // console.log('Hello');
    $(`#${id}`).popover({
        content: ' ',
        ...options
    });
    
	$(`#${id}`).on('inserted.bs.popover', function () {        
        ReactDOM.render(component, document.querySelector('.popover-body'));
	});

	$(`#${id}`).on('hide.bs.popover', function () {
        // Unmount after 100ms to allow for animation
		setTimeout(() => {
			ReactDOM.unmountComponentAtNode(document.querySelector('.popover-body'));
		}, 100);
	});
}