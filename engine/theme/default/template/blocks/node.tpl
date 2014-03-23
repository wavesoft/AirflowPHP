			<div class="node {$node->getClasses()}">
				{foreach $node->layers as $layer} 
				<div class="layer {$layer->getClasses()}" style="{$layer->getStyle()}">
					{$layer->getBody()}
				</div>
				{/foreach}
			</div>
