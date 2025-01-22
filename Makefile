

all:
	@docker-compose -f ./docker-compose.yml  up --build


detach:
	@docker-compose -f ./docker-compose.yml  up --build -d

down:
	@docker-compose -f ./docker-compose.yml  down



clean: down
	@docker image rm localexplorer:mytag || true
	# @docker volume rm srcs_goquant || true

fclean: clean
	chmod -R 777 certs
	rm -rf certs


re: clean all


hellp:
	@echo "Usage: make [all|down|clean|fclean|re|detach]"


.PHONY: all down clean fclean re detach
