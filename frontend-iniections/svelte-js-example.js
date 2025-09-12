function create_fragment(ctx) {
	let p;
	p = document.createElement("p");
	p.innerHTML = /*string*/ ctx[0];
	return {
		c() {
		},
		m(target, anchor) {
			target.insertBefore(p, anchor);
		},
		p(ctx, [dirty]) {
			if (dirty & /*string*/ 1) p.innerHTML = /*string*/ ctx[0];
		},
		d(detaching) {
			if (detaching) p.remove();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let string = `this string contains some <strong>HTML!!!</strong>`;
	
	return [string];
}

class MyComponent extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}